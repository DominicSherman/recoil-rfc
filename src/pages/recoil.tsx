import React, {
  ChangeEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import Select from 'react-select';
import {atom, useRecoilValue, useSetRecoilState} from 'recoil';

import {
  Character,
  Gender,
  Status,
} from '../../types';
import { useInputDebouncing } from '../useInputDebouncing';
import { usePaginatedQuery } from '../usePaginatedQueryRecoil';

const selectedGenderState = atom<Gender | null>({
  key: "selectedGenderFilter",
  default: null
});

const selectedStatusState = atom<Status | null>({
  key: "selectedStatusFilter",
  default: null
})

const debouncedSearchbarInputState = atom<string>({
  key: "debouncedSearchbarInput",
  default: ""
});

const useCharacterData = () => {
  const selectedGender = useRecoilValue(selectedGenderState);
  const selectedStatus = useRecoilValue(selectedStatusState);
  const debouncedSearch = useRecoilValue(debouncedSearchbarInputState);

  return usePaginatedQuery<Character>(['character'], {
    params: {
      name: debouncedSearch,
      gender: selectedGender,
      status: selectedStatus
    },
    pageKey: "recoilPage"
  });
}

export default function Recoil() {
  return (
    <div className="flex flex-col w-screen items-center py-8">
      <h2 className="text-xl font-bold underline">Recoil Example</h2>
      <SearchBar />
      <ResultCount />
      <Pagination />
      <FilterOptions />
      <div className="flex flex-col space-y-2 pt-2">
        <CharacterResults />
      </div>
    </div>
  )
}

const SearchBar = () => {
  const [search, debouncedSearch, onChange] = useInputDebouncing();
  const setDebouncedSearchbarInput = useSetRecoilState(
    debouncedSearchbarInputState
  );

    /** Keep debounced searchbar input in sync with the recoil atom */
  useEffect(() => {
    setDebouncedSearchbarInput(() => debouncedSearch);
  }, [debouncedSearch, setDebouncedSearchbarInput]);

  return (
    <div className="my-2 relative rounded-md shadow-sm">
      <input type="text" className="focus:ring-indigo-500 focus:border-indigo-500 block w-[200px] pl-7 pr-12 sm:text-sm border border-gray-300 rounded-md" placeholder="Search for a name..." onChange={onChange} value={search} />
    </div>
  );
};

const ResultCount = () => {
  const {contentCount} = useCharacterData();

  return (
    <div className="my-2">{`Result count: ${contentCount}`}</div>
  )
}

const FilterOptions = () => {
  const genderOptions: Gender[] = [
    'Female', 'Male', 'Genderless', 'unknown'
  ];
  const statusOptions: Status[] = [
    'Alive', 'Dead', 'unknown'
  ];
  const setSelectedGender = useSetRecoilState(selectedGenderState);
  const setSelectedStatus = useSetRecoilState(selectedStatusState);

  return (
    <div className="flex flex-row space-x-8">
      <Select 
        placeholder="Gender"
        options={genderOptions.map((opt) => ({value: opt, label: opt}))}
        onChange={(gender) => setSelectedGender(() => gender?.value || null)}
      />
      <Select 
        placeholder="Status"
        options={statusOptions.map((opt) => ({value: opt, label: opt}))}
        onChange={(status) => setSelectedStatus(() => status?.value || null)}
      />
    </div>
  );
}

const CharacterResults = () => {
  const {queryResponse: {data, isError}} = useCharacterData();

  if (isError) {
    return <p>Something went wrong, please try again...</p>;
  }

  if (!data) {
    return (
      <>
        {Array.from(Array(20).keys()).map((i) => <LoadingRow key={i} />)}
      </>
    )
  }

  return (
    <>
    {
      data.map((character) => {
        return (
          <div className="flex flex-row space-x-5 items-center" key={character.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={character.name}  className="rounded-full w-8 h-8" src={character.image} />
            <div className="w-32">{character.name}</div>
            <div className="w-32">{character.gender}</div>
            <div className="w-32">{character.status}</div>
          </div>
        )
      })
    }
    </>
  );
}

const LoadingRow = () => 
  <div className="flex flex-row space-x-5 items-center">
    <div className="rounded-full animate-pulse bg-gray-200 w-8 h-8" />
    <div className="w-32 h-6 animate-pulse bg-gray-200 rounded-md" />
    <div className="w-32 h-6 animate-pulse bg-gray-200 rounded-md" />
    <div className="w-32 h-6 animate-pulse bg-gray-200 rounded-md" />
  </div>

const Pagination = () => {
  const {
    page, 
    setPage, 
    contentCount
  } = useCharacterData();

  const onClickPrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const onClickNext = () => {
    if (page < contentCount / 20) {
      setPage(page + 1);
    }
  }

  return (
    <div className="my-2 flex flex-row items-center space-x-4">
      <div className="cursor-pointer" onClick={onClickPrevious}>Previous</div>
      <div>{page}</div>
      <div className="cursor-pointer" onClick={onClickNext}>Next</div>
    </div>
  )
}