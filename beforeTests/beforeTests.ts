/**
 * Mock the database.
 */
import mock from "mock-require";
const sequelizeMock = require("sequelize-mock");
mock("sequelize", sequelizeMock);