import "./App.css"
import { Asset, mock } from "./mock"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "./app/hooks"
import { updateItem } from "./features/assets/assetsSlice"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { RootState } from "./app/store"

function App() {
  const assets: Asset[] = useAppSelector(
    (state: RootState) => state.assets.items,
  )
  const [selectedOption, setSelectedOption] = useState("all")
  const dispatch = useAppDispatch()

  useEffect(() => {
    mock.subscribe((value: Asset) => {
      dispatch(updateItem({ ...value }))
    })
  }, [])

  const [searchText, setSearchText] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(event?.target?.value)
    },
    [],
  )

  const handleSortChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target
      setSortOrder(value)
    },
    [],
  )

  const filteredData = useMemo(
    () =>
      assets.filter(
        (item) =>
          item.assetName.toLowerCase().includes(searchText.toLowerCase()) &&
          (selectedOption === "all" ||
            item.assetType.toLowerCase() === selectedOption),
      ),
    [assets, selectedOption, searchText],
  )

  const sortedData = useMemo(
    () =>
      filteredData.sort((a, b) => {
        const compareValue = (valueA: string, valueB: string) => {
          if (valueA < valueB) return -1
          if (valueA > valueB) return 1
          return 0
        }

        const sortMultiplier = sortOrder === "asc" ? 1 : -1

        return compareValue(a.assetName, b.assetName) * sortMultiplier
      }),
    [filteredData, sortOrder],
  )

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value)
  }

  return (
    <Box sx={{ margin: 5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <TextField
          label="Search"
          value={searchText}
          placeholder="Search by name"
          onChange={handleSearchChange}
        />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <InputLabel id="select-label">Filter by type</InputLabel>
          <Select
            labelId="select-label"
            id="select"
            value={selectedOption}
            onChange={handleChange}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="stock">Stock</MenuItem>
            <MenuItem value="currency">Currency</MenuItem>
          </Select>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>
                <Select select value={sortOrder} onChange={handleSortChange}>
                  <MenuItem value="asc">Name (Ascending)</MenuItem>
                  <MenuItem value="desc">Name (Descending)</MenuItem>
                </Select>
              </TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Last Update</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.assetName}</TableCell>
                <TableCell>{item.assetType}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>
                  {new Date(item.lastUpdate).toLocaleString()}{" "}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default App
