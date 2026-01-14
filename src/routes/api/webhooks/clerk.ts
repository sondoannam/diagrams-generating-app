import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '@/db'

// Clerk webhook event types we handle
type ClerkWebhookEvent = {
  data: {
    id: string
    email_addresses: Array<{
      id: string
      email_address: string
    }>
    primary_email_address_id: string | null
    first_name: string | null
    last_name: string | null
    image_url: string | null
  }
  type: 'user.created' | 'user.updated' | 'user.deleted'
}

export const Route = createFileRoute('/api/webhooks/clerk')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const payload: ClerkWebhookEvent = await request.json()

          const { type, data } = payload

          // Get primary email
          const primaryEmail = data.email_addresses.find(
            (email) => email.id === data.primary_email_address_id
          )?.email_address

          // Construct full name
          const fullName = [data.first_name, data.last_name]
            .filter(Boolean)
            .join(' ') || null

          switch (type) {
            case 'user.created': {
              // Create user in our database
              await prisma.user.create({
                data: {
                  clerkId: data.id,
                  email: primaryEmail || '',
                  fullName,
                  avatarUrl: data.image_url,
                },
              })

              console.log(`[Clerk Webhook] User created: ${data.id}`)
              break
            }

            case 'user.updated': {
              // Update user in our database
              await prisma.user.update({
                where: { clerkId: data.id },
                data: {
                  email: primaryEmail || undefined,
                  fullName,
                  avatarUrl: data.image_url,
                },
              })

              console.log(`[Clerk Webhook] User updated: ${data.id}`)
              break
            }

            case 'user.deleted': {
              // Delete user from our database (cascades to diagrams)
              await prisma.user.delete({
                where: { clerkId: data.id },
              })

              console.log(`[Clerk Webhook] User deleted: ${data.id}`)
              break
            }

            default:
              console.log(`[Clerk Webhook] Unhandled event type: ${type}`)
          }

          return Response.json({ success: true })
        } catch (error) {
          console.error('[Clerk Webhook] Error:', error)
          return Response.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
          )
        }
      },
    },
  },
})
