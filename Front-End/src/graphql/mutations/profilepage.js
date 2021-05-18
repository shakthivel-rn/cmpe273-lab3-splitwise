import gql from 'graphql-tag';

const editNameMutation = gql`
mutation EditName($userId: String, $name: String) {
    editName(userId:$userId, name:$name)
}
`;

const editEmailMutation = gql`
mutation EditEmail($userId: String, $email: String) {
    editEmail(userId:$userId, email:$email)
}
`;

const editPhoneNumberMutation = gql`
mutation EditPhoneNumber($userId: String, $phone: String) {
    editPhoneNumber(userId:$userId, phone:$phone)
}
`;

const editLanguageMutation = gql`
mutation Editlanguage($userId: String, $language: String) {
    editLanguage(userId:$userId, language:$language)
}
`;

const editDefaultCurrencyMutation = gql`
mutation EditDefaultCurrency($userId: String, $defaultcurrency: String) {
    editDefaultCurrency(userId:$userId, defaultcurrency:$defaultcurrency)
}
`;

const editTimeZoneMutation = gql`
mutation EditTimeZone($userId: String, $timezone: String) {
    editTimeZone(userId:$userId, timezone:$timezone)
}
`;

export {
  editNameMutation, editEmailMutation, editPhoneNumberMutation,
  editLanguageMutation, editDefaultCurrencyMutation, editTimeZoneMutation,
};
