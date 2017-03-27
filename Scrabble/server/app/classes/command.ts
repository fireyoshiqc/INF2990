/**
 * command.ts - implements a command for a scrabble game
 *
 * @authors Mikael Ferland, Pierre To
 * @date 2017/03/11
 */

export enum CommandType {
    PLACER,
    CHANGER,
    PASSER,
    AIDE
}

export enum CommandStatus {
    UNDEFINED_COMMAND, // Command does not exist (see EXISTING_COMMAND)
    INVALID_COMMAND_SYNTAX, // Command does not have proper syntax
    VALID_COMMAND
}


export class Command {
    public static helpMessage =
    "Placer un mot sur le plateau du jeu: \n" +
    "!placer <ligne><colonne>(h|v) <mot> \n" +
    "Ligne: Une lettre entre A et O \n" +
    "Colonne: Un chiffre entre 1 et 15 \n" +
    "(h|v): L'orientation du mot est soit Horizontale ou Verticale \n" +
    "mot: Le mot doit au moins avoir 2 lettres. Chaque lettre du mot est entrée en minuscule," +
    "sauf lorsqu’il s’agit d’une lettre blanche," +
    "qui elle, doit être entrée en majuscule. Le mot doit être écrit au complet en y incluant, " +
    "si nécessaire, les lettres se trouvant déjà sur le plateau de jeu. \n" +
    "Ex: !placer g15v bonjour : joue le mot bonjour à la verticale et le b est positionné en g15.\n\n" +
    "Pour changer les lettres du chevalet:\n" +
    "!changer <lettres>\n" +
    "lettres: Spécifiez jusqu'à 7 lettres à échanger de votre chevalet. Toutes les lettres doivent" +
    "se trouver sur votre chevalet. Utilisez * pour indiquer une lettre blanche. \n" +
    "Ex: !changer e* : remplace une seule des lettres e et une lettre blanche.\n\n" +
    "Passer votre tour:\n" +
    "!passer \n";

    private commandType: CommandType;
    private commandStatus: CommandStatus;

    constructor(commandType: CommandType, commandStatus: CommandStatus) {
        this.commandType = commandType;
        this.commandStatus = commandStatus;
    }

    public getCommandType(): CommandType {
        return this.commandType;
    }

    public getCommandStatus(): CommandStatus {
        return this.commandStatus;
    }
}
