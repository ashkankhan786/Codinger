import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { api, internal } from "./_generated/api";
const http = httpRouter();

http.route({
  path: "/lemon-squeezy-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const signature = request.headers.get("X-Signature");

    if (!signature) {
      return new Response("Missing X-Signature header", { status: 400 });
    }
    try {
      const payload = await ctx.runAction(internal.lemonSqueezy.verifyWebhook, {
        payload: payloadString,
        signature,
      });

      if (payload.meta.event_name === "order_created") {
        const { data } = payload;

        const { success } = await ctx.runMutation(api.users.upgradeToPro, {
          email: data.attributes.user_email,
          lemonSqueezyCustomerId: data.attributes.customer_id.toString(),
          lemonSqueezyOrderId: data.id,
          amount: data.attributes.total,
        });
        if (success) {
          //optionally send an email or notification
        }
      }
      return new Response("Webhook processed successfully", { status: 200 });
    } catch (error) {
      return new Response(`Error processing webhook: ${error}`, {
        status: 500,
      });
    }
  }),
});

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("CLERK_WEBHOOK_SECRET is not set");
    }
    const svix_id = req.headers.get("svix-id");
    const svix_signature = req.headers.get("svix-signature");
    const svix_timestamp = req.headers.get("svix-timestamp");
    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("Missing required headers", {
        status: 400,
      });
    }
    const payload = await req.json();
    const body = JSON.stringify(payload);
    const wh = new Webhook(webhookSecret);
    let event;
    try {
      event = wh.verify(body, {
        "svix-id": svix_id,
        "svix-signature": svix_signature,
        "svix-timestamp": svix_timestamp,
      }) as WebhookEvent;
    } catch (error) {
      console.error("Webhook verification failed:", error);
      return new Response("Invalid webhook signature", {
        status: 400,
      });
    }
    const eventType = event.type;
    if (eventType === "user.created") {
      //save the user to convex db
      const { id, email_addresses, first_name, last_name } = event.data;
      const email = email_addresses[0].email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      try {
        await ctx.runMutation(api.users.syncUser, {
          userId: id,
          email,
          name,
        });
      } catch (error) {
        console.error("Error saving user to Convex:", error);
        return new Response("Error saving user", {
          status: 500,
        });
      }
    }
    return new Response("Webhook received", {
      status: 200,
    });
  }),
});

export default http;
