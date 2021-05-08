import gql from 'graphql-tag';

const loginMutation = gql`
mutation Login($email: String, $password: String) {
  login(email: $email, password: $password)
}
`;

export default loginMutation;
