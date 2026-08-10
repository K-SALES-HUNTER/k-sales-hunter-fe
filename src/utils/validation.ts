export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 비밀번호 규칙 — 디자인 문구: '영문 대/소문자, 숫자 조합 10글자 이상' */
export const isValidPassword = (password: string): boolean =>
  password.length >= 10 &&
  /[a-z]/.test(password) &&
  /[A-Z]/.test(password) &&
  /\d/.test(password);

export const PASSWORD_RULE_MESSAGE = '영문 대/소문자, 숫자 조합 10글자 이상으로 입력해주세요.';
export const PASSWORD_MISMATCH_MESSAGE = '비밀번호가 일치하지 않습니다.';
export const EMAIL_FORMAT_MESSAGE = '올바른 이메일 형식이 아닙니다.';
