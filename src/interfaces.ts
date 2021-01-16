export interface JWT {
  user: {
    discordId: string;
  };
  iat: number;
  exp: number;
}
