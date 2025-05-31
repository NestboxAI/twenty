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
  locale: keyof typeof APP_LOCALES;
};

export const ApiKeyCreatedEmail = ({
  apiKeyToken,
  apiKeyName,
  workspaceName,
  serverUrl,
  adminEmail,
  locale,
}: ApiKeyCreatedEmailProps) => {
  return (
    <BaseEmail width={400} locale={locale}>
      <Title value={i18n._('Your Twenty instance is ready!')} />
      <MainText>
        {`Congratulations! Your Twenty workspace "${workspaceName}" has been successfully set up and is ready to use.`}
      </MainText>
      <br />
      <MainText>
        {`You can now access your workspace at ${serverUrl} using your login credentials:`}
      </MainText>
      <br />
      <MainText>
        {`Email: ${adminEmail}`}
      </MainText>

      <HighlightedContainer>
        <HighlightedText value={i18n._('API Key Information')} />
        <MainText>
          {`API Key Name: ${apiKeyName}`}
        </MainText>
        <br />
        <MainText>
          API Key Token:
        </MainText>
        <ShadowText>{apiKeyToken}</ShadowText>
        <CallToAction href={serverUrl} value={i18n._('Access Your Workspace')} />
      </HighlightedContainer>

      <MainText>
        Keep your API key secure and do not share it with unauthorized users. You can manage your API keys from the workspace settings.
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
  locale: 'en',
} as ApiKeyCreatedEmailProps;

export default ApiKeyCreatedEmail; 