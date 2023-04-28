FROM mcr.microsoft.com/devcontainers/typescript-node:20
RUN curl -L https://foundry.paradigm.xyz | bash
RUN foundryup | bash