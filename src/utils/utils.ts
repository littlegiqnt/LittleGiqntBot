export const isProduction = process.env.NODE_ENV?.toLowerCase() === "production";

export const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min)) + min;
