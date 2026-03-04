import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ToolkitProvider from '../context';
import SearchBar from '../src/search/SearchBar';

describe('Toolkit Test Suite', () => {
  const columns = [
    { dataField: 'id', text: 'ID' },
    { dataField: 'name', text: 'Name' }
  ];
  const data = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' }
  ];

  it('should handle search correctly', async () => {
    let capturedSearchText = '';
    
    render(
      <ToolkitProvider
        keyField="id"
        data={data}
        columns={columns}
        search
      >
        {(props: any) => {
          capturedSearchText = props.searchProps.searchText;
          return (
            <div>
               <SearchBar { ...props.searchProps } />
            </div>
          );
        }}
      </ToolkitProvider>
    );

    const input = await screen.findByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.keyUp(input);

    await waitFor(() => {
      expect(capturedSearchText).toBe('test');
    }, { timeout: 1000 });
  });

  it('SearchBar should handle value change independently', async () => {
    const onSearch = jest.fn();
    render(
      <SearchBar
        onSearch={onSearch}
        delay={0}
      />
    );

    const input = screen.getByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: 'hello' } });
    fireEvent.keyUp(input);

    await waitFor(() => {
        expect(onSearch).toHaveBeenCalledWith('hello');
    });
  });
});
