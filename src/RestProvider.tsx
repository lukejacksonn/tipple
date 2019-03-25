import React, { FC, useState, useMemo } from 'react';
import { Context, TakeAContext } from './context';

type DomainMap = Record<string, string[]>;
type ResponseMap = Record<string, any>;

interface ProviderProps {
  baseUrl?: string;
}

export const TakeAProvider: FC<ProviderProps> = ({ baseUrl, children }) => {
  const [domains, setDomains] = useState<DomainMap>({});
  const [responses, setResponses] = useState<ResponseMap>({});

  const addResponse = useMemo(
    () => createAddResponse(domains, responses, setDomains, setResponses),
    [domains, responses]
  );
  const clearDomains = useMemo(
    () => createClearDomains(domains, responses, setResponses),
    [domains, responses]
  );

  const config = { baseUrl };

  return (
    <TakeAContext.Provider
      value={{ config, domains, responses, addResponse, clearDomains }}
    >
      {children}
    </TakeAContext.Provider>
  );
};

const createAddResponse = (
  domains: Record<string, string[]>,
  responses: Record<string, any>,
  setDomains: (arg: Record<string, string[]>) => void,
  setResponses: (arg: Record<string, any>) => void
): Context['addResponse'] => ({ key, domains: domainArr, data }) => {
  const updatedDomains = domainArr.reduce(
    (p, d) => ({ ...p, [d]: p[d] === undefined ? [key] : [...p[d], key] }),
    domains
  );

  setDomains(updatedDomains);
  setResponses({ ...responses, [key]: data });
};

const createClearDomains = (
  domains: Record<string, string[]>,
  responses: Record<string, any>,
  setResponses: (arg: Record<string, any>) => void
): Context['clearDomains'] => targetDomains =>
  targetDomains.forEach(domain => {
    if (domains[domain] === undefined) {
      return;
    }

    const updatedResponses = domains[domain].reduce(
      (p, d) => ({
        ...p,
        [d]: undefined,
      }),
      responses
    );
    setResponses(updatedResponses);
  });
