export const parseData = (
  recipeString: string,
  setRecipeName: React.Dispatch<React.SetStateAction<string>>,
  setIngredient: React.Dispatch<React.SetStateAction<string[]>>,
  setCook: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const recipeName = recipeString.match(/레시피 이름: (.+)/)![1];
  const ingredients = recipeString.match(/재료: (.+)/)![1].split(", ");
  // const instructions = recipeString
  //   .match(/조리방법: \n(.+)/s)![1]
  //   .trim()
  //   .split("\n");
  let instructions: any;
  const instructionsMatch = recipeString.match(/조리방법: \n(.+)/s);
  if (instructionsMatch) {
    instructions = instructionsMatch[1].trim().split("\n");
  } else {
    const instructionsAltMatch = recipeString.match(/조리방법: (.+)/s);
    if (instructionsAltMatch) {
      instructions = instructionsAltMatch[1].trim().split(". ");
    } else {
      instructions = [];
    }
  }

  setRecipeName(recipeName);
  setIngredient(ingredients);
  setCook(instructions);
};
