import createEndpoint from 'lib/api/utils/createEndpoint';
import Response from 'lib/api/domain/Response';
import { updateReferralStatus } from 'lib/dependencies';

export const endpoint = ({ updateReferralStatus }) =>
  createEndpoint({ allowedMethods: ['PATCH'] }, async ({ params: { id }, body: referral }) => {
    await updateReferralStatus.execute({ referral });
    return Response.noContent();
  });

export default endpoint({ updateReferralStatus });
