import { rgba } from "polished";
import styled from "styled-components";
import { styleWhen } from "../utils/utils";

export const Button = styled.button<{ kind?: "primary" | "normal" }>`
  position: relative;
  display: block;
  width: 100%;
  padding: 8px;
  overflow: hidden;

  color: #fff;
  text-align: center;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  outline: none;

  transition-property: background-color, color;
  transition: 0.2s ease-in-out;

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &:focus,
  &:active {
    box-shadow: 0 0 0 3px ${rgba("#6128d2", 0.3)};
  }

  ${({ kind }) => styleWhen(kind == null || kind === "normal")`
    background-color: #e8e8e8;
    color: ${rgba("#4f4f56", 0.8)};

    &:hover {
      background-color: #dad6d6;
    }
  `}

  ${({ kind }) => styleWhen(kind === "primary")`
    background: linear-gradient(45deg, #6128d2, #cc39ac, #e42359);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 0;
      background-color: ${rgba("#000", 0)};
      transition-property: background-color, color;
      transition: 0.2s ease-in-out;
    }

    &:hover {
      &::before {
        background-color: ${rgba("#000", 0.1)};
      }
    }
  `}
`;
