import { Webhook } from 'svix';
import { env } from '../../config/env.js';
import User from '../../models/User.js';

export async function handleClerkWebhook(req, res) {
  if (!env.clerkWebhookSecret) {
    return res.status(500).json({ error: 'CLERK_WEBHOOK_SECRET not configured' });
  }

  const wh = new Webhook(env.clerkWebhookSecret);
  const headers = {
    'svix-id': req.headers['svix-id'],
    'svix-timestamp': req.headers['svix-timestamp'],
    'svix-signature': req.headers['svix-signature'],
  };

  let event;
  try {
    event = wh.verify(req.body, headers);
  } catch {
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  const { type, data } = event;

  if (type === 'user.created' || type === 'user.updated') {
    const email = data.email_addresses?.[0]?.email_address;
    const name = `${data.first_name || ''} ${data.last_name || ''}`.trim();
    await User.findOneAndUpdate(
      { clerkId: data.id },
      { clerkId: data.id, email, name, avatarUrl: data.image_url },
      { upsert: true, new: true }
    );
  }

  if (type === 'user.deleted') {
    await User.deleteOne({ clerkId: data.id });
  }

  res.json({ received: true });
}
