import {
  Category as CategoryComponent,
  CategoryContent,
  CategoryHeader,
} from '../components/category.js';
import { ComponentChild, FunctionComponent } from 'preact';

export const Category: FunctionComponent<{ header: ComponentChild }> = ({
  children,
  header,
}) => (
  <CategoryComponent>
    <CategoryHeader>{header}</CategoryHeader>
    <CategoryContent>{children}</CategoryContent>
  </CategoryComponent>
);
