import jwt from "jsonwebtoken";

export const generateAccessToken = (userId, role) => {
  const token = jwt.sign(
    { id: userId, role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return token;
};
export const generateRefreshToken = (userId, role) => {
  const token = jwt.sign(
    { id: userId, role },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30d",
    }
  );

  return token;
};
