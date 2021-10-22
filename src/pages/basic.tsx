import {
  SetStateAction,
  useState,
} from 'react';
import Select from 'react-select';

import {
  Character,
  Gender,
  Status,
} from '../../types';
import { useInputDebouncing } from '../useInputDebouncing';
import { usePaginatedQuery } from '../usePaginatedQuery';

export default function Basic() {
  const [search, debouncedSearch, onChange] = useInputDebouncing();
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null)
  const genderOptions: Gender[] = [
    'Female', 'Male', 'Genderless', 'unknown'
  ];
  const statusOptions: Status[] = [
    'Alive', 'Dead', 'unknown'
  ];
  const {queryResponse, contentCount, page, setPage} = usePaginatedQuery<Character>(['character'], {
    params: {
      name: debouncedSearch,
      gender: selectedGender,
      status: selectedStatus
    }
  });

  return (
    <div className="flex flex-col w-screen items-center py-8">
      <h2 className="text-xl font-bold underline">Recoil Example</h2>
      <div className="my-2 relative rounded-md shadow-sm">
        <input type="text" className="focus:ring-indigo-500 focus:border-indigo-500 block w-[200px] pl-7 pr-12 sm:text-sm border border-gray-300 rounded-md" placeholder="Search for a name..." onChange={onChange} value={search} />
      </div>
      <div className="my-2">{`Result count: ${contentCount}`}</div>
      <Pagination page={page} setPage={setPage} contentCount={contentCount} />
      <div className="flex flex-row space-x-8">
        <Select 
          placeholder="Gender"
          options={genderOptions.map((opt) => ({value: opt, label: opt}))}
          onChange={(gender) => setSelectedGender(gender?.value || null)}
        />
        <Select 
          placeholder="Status"
          options={statusOptions.map((opt) => ({value: opt, label: opt}))}
          onChange={(status) => setSelectedStatus(status?.value || null)}
        />
      </div>
      <div className="flex flex-col space-y-2 pt-2">
        <CharacterResults data={queryResponse.data} isError={queryResponse.isError} />
      </div>
    </div>
  )
}

const CharacterResults = ({data, isError}: {data?: Character[], isError: boolean}) => {
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

const Pagination = ({
  page, 
  setPage, 
  contentCount
}: {
  contentCount: number;
  page: number;
  setPage: React.Dispatch<SetStateAction<number>>;
}) => {
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