import {Stack} from "aws-cdk-lib";


export const getStackSuffix = (stack: Stack) => {
 return stack.stackId.split("")[6];
};