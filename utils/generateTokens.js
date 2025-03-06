import jwt from "jsonwebtoken";

export const generateToken = async (id) => {
  const accessToken = jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "20d"});
  const refreshToken = jwt.sign({id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "30d"});

  return {accessToken, refreshToken};
}
