interface UseUserId {
  id: string | undefined
}

export const useUserId = (): UseUserId => {
  return {id: document!.cookie!.match(/userId=(?<id>[^;]+);?$/)!.groups!.id};
};