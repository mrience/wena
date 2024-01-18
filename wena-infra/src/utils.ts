import {Stack, Fn} from "aws-cdk-lib";


export const getStackSuffix = (stack: Stack) => {
 return Fn.select(6, Fn.split("-", stack.stackId));
};