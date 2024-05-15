export const calculateDday = (expirationDate: string | null): string => {
  if (!expirationDate) {
    return "유통기한을 입력해주세요.";
  }

  const today = new Date();
  const expireDate = new Date(expirationDate);
  const diffTime = expireDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `D+${Math.abs(diffDays)}`;
  } else {
    return `D-${diffDays}`;
  }
};

export default calculateDday;
