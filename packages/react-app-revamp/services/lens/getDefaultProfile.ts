import { client } from '@config/urql';
import { DefaultProfileDocument } from '@graphql/generated';
import type { DefaultProfileRequest } from '@graphql/generated';

/**
 * Get the default Lens profile associated to an Ethereum address
 * @param request: `{ ethereumAddress }`
 * @returns associated Lens profile or `undefined`
 */
export async function getDefaultProfile(request: DefaultProfileRequest) {
  const profile = await client
    .query(DefaultProfileDocument, {
      request,
    })
    .toPromise()
    return profile
  }
  

