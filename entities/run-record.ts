export type RunRecord = {
  guildId: string;
  userId: string;
  date: Temporal.ZonedDateTime;
};

export const runRecord = {
  async getAll(guildId: string): Promise<RunRecord[]> {
    return [];
  },

  async create(newRecord: RunRecord): Promise<void> {
  },

  async createMany(newRecords: RunRecord[]): Promise<void> {
  },
};
