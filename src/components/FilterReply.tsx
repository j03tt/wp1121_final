"use client";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { RefreshCcw, Search } from "lucide-react"
import { useRouter, usePathname, useSearchParams, redirect } from "next/navigation";
import { useSession } from "next-auth/react";
const options = [
    'Latest on top (Default)',
    'Oldest on top',
    'Highest Rating on top',
    'Lowest Rating on top',
    'Most Liked on top',
    'Most Hated on top',
  ];
export default function FilterReply(){
  const router = useRouter();
  const {data: session} = useSession();
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams);
  const init = (params.get("Filter"))? parseInt(params.get("Filter")!) : 0;
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(init);
  const open = Boolean(anchorEl);
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setAnchorEl(null);
    // if(!keyword){
    //   // console.log(pathname)
    //   const params = new URLSearchParams(searchParams);
    //   params.delete("keyWord");
    //   router.push(`${pathname}?${params.toString()}`);
    //   return;
    // }

    // keywordInputRef.current.dispatchEvent(
    //   new Event("input", { bubbles: true, composed: true }),
    // );
    const params = new URLSearchParams(searchParams);
    params.set("Filter", index.toString());
    router.push(`${pathname}?${params.toString()}`);
    window.location.replace(`${pathname}?${params.toString()}`);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <div>
      <List
        component="nav"
        aria-label="Device settings"
        sx={{
          bgcolor: '#000000',
          borderRadius: '8px', // Add border radius
          "&:hover": {
            cursor: 'pointer',
          },
        }}
      >
        <ListItem
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-label="when device is locked"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickListItem}
          sx={{
            borderRadius: '8px', // Add border radius for hover
            "&:hover": {
              backgroundColor: '#333333',
            },
          }}
        >
          <ListItemText primary={options[selectedIndex]} />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'lock-button',
          role: 'listbox',
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            disabled={index === selectedIndex}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}