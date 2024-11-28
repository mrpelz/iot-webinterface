import { useMemo } from 'preact/hooks';

import { Api, api } from '../api.js';

export const useTypedCollector: Api['$typedCollector'] = (element) =>
  useMemo(() => api.$typedCollector(element), [element]);

export const useTypedEmitter: Api['$typedEmitter'] = (element) =>
  useMemo(() => api.$typedEmitter(element), [element]);
