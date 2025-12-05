// import { createFileRoute } from "@tanstack/react-router";
// import apiInstance, { isBrevoConfigured } from "@config/brevo";
// import * as Brevo from "@getbrevo/brevo";
// 
// export const Route = createFileRoute("/api/brevo/send")({
//   server: {
//     handlers: {
//       POST: async ({ request }: { request: Request }) => {
//         if (!isBrevoConfigured) {
//           return new Response(JSON.stringify({ error: "brevo is not configured" }), {
//             status: 400,
//             headers: { "Content-Type": "application/json" },
//           });
//         }
// 
//         try {
//           const body = await request.json();
//           const { to, templateId, params } = body;
// 
//           if (!to || !templateId) {
//             return new Response(
//               JSON.stringify({ error: "missing required parameters: to and templateId are required" }),
//               {
//                 status: 400,
//                 headers: { "Content-Type": "application/json" },
//               },
//             );
//           }
// 
//           const sendSmtpEmail = new Brevo.SendSmtpEmail();
//           sendSmtpEmail.to = to;
//           sendSmtpEmail.templateId = templateId;
// 
//           if (params) {
//             sendSmtpEmail.params = params;
//           }
// 
//           const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
//           return new Response(JSON.stringify({ success: true, data }), {
//             status: 200,
//             headers: { "Content-Type": "application/json" },
//           });
//         } catch (error: any) {
//           console.error("error sending email:", error);
//           return new Response(JSON.stringify({ error: error.message ?? "failed to send email" }), {
//             status: 400,
//             headers: { "Content-Type": "application/json" },
//           });
//         }
//       },
//     },
//   },
// } as any);

//TEST BREVO ROUTE
