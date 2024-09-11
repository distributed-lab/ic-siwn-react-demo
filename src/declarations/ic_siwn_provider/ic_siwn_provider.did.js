export const idlFactory = ({ IDL }) => {
  const RuntimeFeature = IDL.Variant({ 'IncludeUriInSeed' : IDL.Null });
  const SettingsInput = IDL.Record({
    'runtime_features' : IDL.Opt(IDL.Vec(RuntimeFeature)),
    'app_url' : IDL.Text,
    'salt' : IDL.Text,
    'session_expires_in' : IDL.Opt(IDL.Nat64),
    'callback_url' : IDL.Text,
    'targets' : IDL.Opt(IDL.Vec(IDL.Text)),
    'chain_id' : IDL.Opt(IDL.Text),
    'sign_in_expires_in' : IDL.Opt(IDL.Nat64),
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Principal, 'Err' : IDL.Text });
  const Delegation = IDL.Record({
    'pubkey' : IDL.Vec(IDL.Nat8),
    'targets' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'expiration' : IDL.Nat64,
  });
  const SignedDelegation = IDL.Record({
    'signature' : IDL.Vec(IDL.Nat8),
    'delegation' : Delegation,
  });
  const Result_2 = IDL.Variant({ 'Ok' : SignedDelegation, 'Err' : IDL.Text });
  const LoginDetails = IDL.Record({
    'user_canister_pubkey' : IDL.Vec(IDL.Nat8),
    'expiration' : IDL.Nat64,
  });
  const Result_3 = IDL.Variant({ 'Ok' : LoginDetails, 'Err' : IDL.Text });
  const PrepareLoginDetails = IDL.Record({
    'callback_url' : IDL.Text,
    'message' : IDL.Text,
    'nonce' : IDL.Text,
  });
  const Result_4 = IDL.Variant({
    'Ok' : PrepareLoginDetails,
    'Err' : IDL.Text,
  });
  return IDL.Service({
    '__get_candid_interface_tmp_hack' : IDL.Func([], [IDL.Text], ['query']),
    'get_account_id' : IDL.Func([IDL.Principal], [Result], ['query']),
    'get_caller_address' : IDL.Func([], [Result], ['query']),
    'get_principal' : IDL.Func([IDL.Text], [Result_1], ['query']),
    'icts_name' : IDL.Func([], [IDL.Text], ['query']),
    'icts_version' : IDL.Func([], [IDL.Text], ['query']),
    'siwn_get_delegation' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Nat8), IDL.Nat64],
        [Result_2],
        ['query'],
      ),
    'siwn_login' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Vec(IDL.Nat8), IDL.Text],
        [Result_3],
        [],
      ),
    'siwn_prepare_login' : IDL.Func([IDL.Text], [Result_4], []),
  });
};
export const init = ({ IDL }) => {
  const RuntimeFeature = IDL.Variant({ 'IncludeUriInSeed' : IDL.Null });
  const SettingsInput = IDL.Record({
    'runtime_features' : IDL.Opt(IDL.Vec(RuntimeFeature)),
    'app_url' : IDL.Text,
    'salt' : IDL.Text,
    'session_expires_in' : IDL.Opt(IDL.Nat64),
    'callback_url' : IDL.Text,
    'targets' : IDL.Opt(IDL.Vec(IDL.Text)),
    'chain_id' : IDL.Opt(IDL.Text),
    'sign_in_expires_in' : IDL.Opt(IDL.Nat64),
  });
  return [SettingsInput];
};
