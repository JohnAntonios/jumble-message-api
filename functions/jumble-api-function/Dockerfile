FROM public.ecr.aws/lambda/nodejs:14

RUN npm install -g yarn

COPY src/ ${LAMBDA_TASK_ROOT}/src

COPY __tests__/  ${LAMBDA_TASK_ROOT}/__tests__

COPY package.json yarn.lock tsconfig.json ${LAMBDA_TASK_ROOT}/

RUN yarn

RUN yarn test

RUN yarn build