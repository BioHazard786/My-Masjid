import { client } from '@web/lib/api-client';
import type { Masjid } from '@web/lib/types';

export const searchMasjids = async (query: string) => {
  if (!query) {
    // Return a success state with empty data to prevent API calls
    return { success: true, data: [] as Masjid[] };
  }

  const response = await client.user.masjids.search.$get({
    query: { q: query },
  });

  if (!response.ok) {
    // This handles network errors, not application errors
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getMasjidById = async (masjidId: string) => {
  const response = await client.user.masjid[':id'].$get({
    param: { id: masjidId },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
};
