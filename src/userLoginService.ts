import {User} from "./user"
import {FacebookSessionManager} from "./facebookSessionManager";
import {SessionManager} from "./sessionManager";

export class UserLoginService {
    private loggedUsers: User[] = []
    private sessionManager: SessionManager

    constructor(sessionManager: SessionManager) {
        this.sessionManager = sessionManager
    }

    public manualLogin = (user: User): string => {
        if (this.isUserAlreadyLogged(user)) {
            return "User already logged in"
        }

        this.loggedUsers.push(user)
        return "User successfully logged in"
    }

    getLoggedUsers() {
        return this.loggedUsers.map(user => user.getUserName())
    }

    getExternalSessions(): number {
        const externalLoggedUsers = this.sessionManager.getSessions()
        return externalLoggedUsers;
    }

    login(username: string, password: string): string {
        if (!this.sessionManager.login(username, password)) {
            return "Login incorrecto"
        }

        this.loggedUsers.push(new User(username));
        return "Login correcto"
    }

    logout(user: User): string {
        try {
            if (!this.loggedUsers.includes(user)) {
                return "User not found"
            }

            this.loggedUsers = this.loggedUsers.filter(arrayUser => arrayUser != user);
            this.sessionManager.logout(user.getUserName())
            return "User logged out"

        } catch (e) {
            if (e.message === 'ServiceNotAvailable') {
                return 'Service not available'
            }

            return 'User not logged in Facebook'
        }
    }

    private isUserAlreadyLogged = (user: User) => this.loggedUsers.some(loggedUser => loggedUser.getUserName() === user.getUserName())
}
