import jwt from "jsonwebtoken";
import crypto from "crypto";

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

export const generateResetToken = () => {
  const resetToken = crypto.randomBytes(60).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const expireTime = Date.now() + 10 * 60 * 1000; // 10 mins
  return { resetToken, hashedToken, expireTime };
};
