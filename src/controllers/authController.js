import * as authService from "../services/authService.js";

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/api/auth"
};

export async function register(req, res, next) {
  try {
    const user = await authService.register({
      email: req.body.email,
      password: req.body.password
    });

    res.status(201).json({
      user
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.login({
      email: req.body.email,
      password: req.body.password
    });

    res.cookie(
      "refreshToken",
      result.refreshToken,
      refreshCookieOptions
    );

    res.json({
      accessToken: result.accessToken,
      user: result.user
    });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req, res, next) {
  try {
    const result = await authService.refresh(
      req.cookies.refreshToken
    );

    res.cookie(
      "refreshToken",
      result.refreshToken,
      refreshCookieOptions
    );

    res.json({
      accessToken: result.accessToken,
      user: result.user
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    await authService.logout(req.user.id);

    res.clearCookie(
      "refreshToken",
      refreshCookieOptions
    );

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    const user = await authService.getCurrentUser(
      req.user.id
    );

    res.json({
      user
    });
  } catch (error) {
    next(error);
  }
}