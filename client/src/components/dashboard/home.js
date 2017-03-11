export class Home {
    name = '';
    username = '';

    constructor() {

    }

    activate() {
        let username = localStorage.getItem('game-user');

        console.log(username);

        if (username) {
            this.username = username;
        }
    }

    attached() {

    }

    onSubmitAddUser() {
        this.username = this.name;
        console.log(this.name);
        localStorage.setItem('game-user', this.name);
    }
}
