import {DataTypes, Model} from "sequelize";
import sequelize from "../config/sequelize-config.js";

class User extends Model {
}

User.init(
    {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        passwordUpdatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        passwordResetToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        role: {
            type: DataTypes.ENUM(
                "ROLE_ADMIN",
                "ROLE_STORE_KEEPER",
                "ROLE_USER"
            ),
            defaultValue: "ROLE_USER",
            allowNull: false,
        },

        loginAttempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        blockedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        isValidate: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        authToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: true,
        modelName: "User",
    }
);
export default User;
