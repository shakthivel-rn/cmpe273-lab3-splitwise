import gql from 'graphql-tag';

const loginMutation = gql`
mutation Login($email: String, $password: String) {
  login(email: $email, password: $password)
}
`;

const signUpMutation = gql`
mutation Signup($name: String, $email: String, $password: String) {
  signup(name:$name, email:$email, password:$password)
}
`;
export { loginMutation, signUpMutation };
