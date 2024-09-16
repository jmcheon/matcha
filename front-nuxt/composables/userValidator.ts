export const useValidator = () => {
  const DEFAULT_MAX = 20;
  const DEFAULT_MIN = 2;

  const validator = (
    dirty: ComputedRef<boolean>,
    value: ComputedRef<any>,
    rules: Array<(value: any) => string | undefined>,
  ) => {
    return {
      error: computed(() => {
        if (!dirty.value) return;
        for (const rule of rules) {
          const result = rule(value.value);
          if (result) return result;
        }
      }),
    };
  };

  const emailRule = (errorMessage: string) => {
    const regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    return (value: string) => (!regex.test(value) ? errorMessage : undefined);
  };

  const passwordRule = (errorMessage: string) => {
    const regex =
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}/;
    return (value: string) => (!regex.test(value) ? errorMessage : undefined);
  };

  const maxLengthRule = (errorMessage: string, maxLength?: number) => {
    return (value: string) =>
      value.length > (maxLength ?? DEFAULT_MAX) ? errorMessage : undefined;
  };

  const minLengthRule = (errorMessage: string, minLength?: number) => {
    return (value: string) =>
      value.length < (minLength ?? DEFAULT_MIN) ? errorMessage : undefined;
  };

  const requiredRule = (errorMessages: string) => {
    return (value: string) => (!value.length ? errorMessages : undefined);
  };

  const usernameValidator = (
    dirty: ComputedRef<boolean>,
    username: ComputedRef<string>,
    t: any, // I18n
  ) => {
    return validator(dirty, username, [
      requiredRule(t('Error.REQUIRED', { value: t('_Global.username') })),
      minLengthRule(
        t('Error.MIN_LENGTH', {
          value: t('_Global.username'),
          length: DEFAULT_MIN,
        }),
      ),
      maxLengthRule(
        t('Error.MAX_LENGTH', {
          value: t('_Global.username'),
          length: DEFAULT_MAX,
        }),
      ),
    ]);
  };

  const firstNameValidator = (
    dirty: ComputedRef<boolean>,
    firstName: ComputedRef<string>,
    t: any, // I18n
  ) => {
    return validator(dirty, firstName, [
      requiredRule(t('Error.REQUIRED', { value: t('_Global.firstName') })),
      minLengthRule(
        t('Error.MIN_LENGTH', {
          value: t('_Global.firstName'),
          length: DEFAULT_MIN,
        }),
      ),
      maxLengthRule(
        t('Error.MAX_LENGTH', {
          value: t('_Global.firstName'),
          length: DEFAULT_MAX,
        }),
      ),
    ]);
  };

  const lastNameValidator = (
    dirty: ComputedRef<boolean>,
    lastName: ComputedRef<string>,
    t: any, // I18n
  ) => {
    return validator(dirty, lastName, [
      requiredRule(t('Error.REQUIRED', { value: t('_Global.lastName') })),
      minLengthRule(
        t('Error.MIN_LENGTH', {
          value: t('_Global.lastName'),
          length: DEFAULT_MIN,
        }),
      ),
      maxLengthRule(
        t('Error.MAX_LENGTH', {
          value: t('_Global.lastName'),
          length: DEFAULT_MAX,
        }),
      ),
    ]);
  };

  const emailValidator = (
    dirty: ComputedRef<boolean>,
    email: ComputedRef<string>,
    t: any, // I18n
  ) => {
    return validator(dirty, email, [
      requiredRule(t('Error.REQUIRED', { value: t('_Global.email') })),
      emailRule(t('Error.INVALID_EMAIL')),
    ]);
  };

  const passwordValidator = (
    dirty: ComputedRef<boolean>,
    password: ComputedRef<string>,
    t: any, // I18n
  ) => {
    return validator(dirty, password, [
      requiredRule(t('Error.REQUIRED', { value: t('_Global.password') })),
      passwordRule(t('Error.INVALID_PASSWORD')),
    ]);
  };

  return {
    validator,
    usernameValidator,
    firstNameValidator,
    lastNameValidator,
    emailValidator,
    passwordValidator,
    passwordRule,
    emailRule,
    maxLengthRule,
    minLengthRule,
    requiredRule,
    DEFAULT_MAX,
    DEFAULT_MIN,
  };
};
