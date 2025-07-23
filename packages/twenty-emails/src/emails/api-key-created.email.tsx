import { i18n } from '@lingui/core';
import { BaseEmail } from 'src/components/BaseEmail';
import { CallToAction } from 'src/components/CallToAction';
import { HighlightedContainer } from 'src/components/HighlightedContainer';
import { HighlightedText } from 'src/components/HighlightedText';
import { MainText } from 'src/components/MainText';
import { ShadowText } from 'src/components/ShadowText';
import { Title } from 'src/components/Title';
import { APP_LOCALES } from 'twenty-shared/translations';

type ApiKeyCreatedEmailProps = {
  apiKeyToken: string;
  apiKeyName: string;
  workspaceName: string;
  serverUrl: string;
  adminEmail: string;
  adminPassword: string;
  locale: keyof typeof APP_LOCALES;
};

export const ApiKeyCreatedEmail = ({
  apiKeyToken,
  apiKeyName,
  workspaceName,
  serverUrl,
  adminEmail,
  adminPassword,
  locale,
}: ApiKeyCreatedEmailProps) => {
  return (
    <BaseEmail width={400} locale={locale}>
      <Title value={i18n._('Your AI-Powered workspace is ready!')} />
      <MainText>
        {`Congratulations! Your workspace "${workspaceName}" has been successfully set up and is ready to use.`}
      </MainText>
      <MainText>
        {`Below are your workspace access details and credentials.`}
      </MainText>
      <br />
      <HighlightedContainer>
        <HighlightedText value={i18n._('Workspace Access Details')} />

        <MainText>Workspace Name</MainText>
        <ShadowText>{workspaceName}</ShadowText>

        <MainText>Workspace Access</MainText>
        <ShadowText>{serverUrl}</ShadowText>

        <MainText>Admin Email</MainText>
        <ShadowText>{adminEmail}</ShadowText>

        <MainText>Admin Password</MainText>
        <ShadowText>{adminPassword}</ShadowText>

        <MainText>API Key</MainText>
        <ShadowText>{apiKeyName}</ShadowText>

        <MainText>API Key Token</MainText>
        <ShadowText>{apiKeyToken}</ShadowText>

        <CallToAction href={serverUrl} value={i18n._('Access Your Workspace')} />
      </HighlightedContainer>

      <MainText>
        Keep your API key secure and do not share it with unauthorized users. You can manage your API keys from the workspace settings.
        Please change your admin password after your first login to ensure the security of your workspace.
      </MainText>
      <br />
      <MainText>
        If you have any questions or need assistance, please don't hesitate to reach out to our support team.
      </MainText>
    </BaseEmail>
  );
};

ApiKeyCreatedEmail.PreviewProps = {
  apiKeyToken: 'sk_test_1234567890abcdef1234567890abcdef12345678',
  apiKeyName: 'Initial API Key',
  workspaceName: 'My Company Workspace',
  serverUrl: 'https://app.twenty.com',
  adminEmail: 'admin@company.com',
  adminPassword: 'securepassword123',
  locale: 'en',
} as ApiKeyCreatedEmailProps;

export default ApiKeyCreatedEmail; 