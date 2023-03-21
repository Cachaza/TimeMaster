
# TimeMaster - A WebApp for Students

TimeMaster is a web application that helps students track the time they spend studying different subjects. It allows users to login with their Google or Discord accounts and create a list of subjects they are currently studying. The dashboard displays all the subjects a user has added, and upon clicking a subject, it takes the user to a unique page where they can track their study time using either a pomodoro timer or a chronometer. The app saves the time studied for each subject in a database, allowing users to monitor their progress and incentivize them to study more.

## Images
![User panel](https://media.discordapp.net/attachments/1061231463405719557/1087556978215239731/Screenshot_from_2023-03-21_03-01-02.png?width=970&height=523)
User panel

![subject page](https://media.discordapp.net/attachments/1061231463405719557/1087557467707281408/Screenshot_from_2023-03-21_03-04-22.png?width=984&height=523)
Subject page


## Demo
- https://time-master-cachaza.vercel.app/

Or the docker version:
- https://timemaster.cachaza.cc


## Technologies Used
The project is built on top of the [T3-Stack](https://create.t3.gg/)
- [Next.js](https://nextjs.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/)
- [TRPC](https://trpc.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [MariaDB](https://mariadb.org/)
- [Docker](https://www.docker.com/)


## Getting Started
To use TimeMaster, you need to have Node.js and Docker installed on your system. Follow these steps to get started:
1. Clone the repository and navigate to the project directory.
2. Run `docker-compose up` to start the MariaDB database and the web app.
3. Open your browser and go to `http://localhost:3000`.
4. Login with your Google or Discord account to access the dashboard.
5. Add the subjects you are studying.
6. Click on a subject to start tracking your study time.

## Contributing
We welcome contributions from the community! If you want to contribute to TimeMaster, please open an issue or submit a pull request. Before contributing, please read our [code of conduct](./CODE_OF_CONDUCT.md).

## License

[MIT](https://choosealicense.com/licenses/mit/)


## Authors

- [@Cachaza](https://www.github.com/cachaza)

