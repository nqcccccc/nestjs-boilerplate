export type AuthPayLoad = {
  iat: number;
  uid: string;
  claims: {
    user_id: string;
    username: string;
    email: string;
  };
};

export type AuthUser = {
  id: string;
  username: string;
  full_name: string;
  email: string;
  scope: string;
  roles: string[];
  is_change_password?: boolean;
};

export type AuthToken = {
  accessToken: string;
  accessTokenExpiresAt: Date;
  refreshToken?: string;
  refreshTokenExpiresAt?: Date;
  user: {
    id: string;
    scope: string;
    roles?: string[];
    is_change_password?: boolean;
  };
};

export type AuthBody = {
  grant_type: string;
  scope: string;
  username?: string;
  password?: string;
  access_token?: string;
};
