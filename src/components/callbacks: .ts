// callbacks: {
//   async session({ session, token }: any) {
//     if (token && session.user) {
//       session.user.id = token.id; // <-- agrega el id aquí
//       session.user.email = token.email;
//       session.user.name = token.name;
//     }
//     return session;
//   },
//   // ...otros callbacks...
// }