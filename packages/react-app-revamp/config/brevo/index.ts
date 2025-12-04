import * as Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, import.meta.env.VITE_BREVO_API_KEY!);

export const isBrevoConfigured = import.meta.env.VITE_BREVO_API_KEY !== undefined;

export default apiInstance;
