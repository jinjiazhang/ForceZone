import sys

def convert_xsb_to_array(xsb_lines):
    # Determine bounds
    max_len = max(len(line) for line in xsb_lines) if xsb_lines else 0
    rows = len(xsb_lines)
    
    # 0 = 空(墙外), 1 = 墙, 2 = 地板, 3 = 目标点, 4 = 箱子, 5 = 箱子在目标点, 6 = 玩家, 7 = 玩家在目标点
    # ' ' (space), '#', '.', '$', '*', '@', '+'
    
    # Pad grid with spaces to make it a rectangle initially
    grid = [list(line.ljust(max_len, ' ')) for line in xsb_lines]
    
    # Mappings
    char_map = {
        '#': 1,
        '.': 3,
        '$': 4,
        '*': 5,
        '@': 6,
        '+': 7
    }
    
    # Flood fill to find "outside" spaces (0)
    # Standard flood fill from the borders for any ' ' character
    visited = set()
    def bfs_outside(start_r, start_c):
        queue = [(start_r, start_c)]
        while queue:
            r, c = queue.pop(0)
            if (r, c) in visited:
                continue
            visited.add((r, c))
            if grid[r][c] == ' ':
                grid[r][c] = 'O' # Mark as Outside
                for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < rows and 0 <= nc < max_len:
                        if grid[nr][nc] == ' ' and (nr, nc) not in visited:
                            queue.append((nr, nc))

    # Trigger flood fill from all border cells
    for r in range(rows):
        bfs_outside(r, 0)
        bfs_outside(r, max_len - 1)
    for c in range(max_len):
        bfs_outside(0, c)
        bfs_outside(rows - 1, c)
        
    numeric_grid = []
    for r in range(rows):
        row_arr = []
        for c in range(len(xsb_lines[r])): # Only process up to the original line length
            char = grid[r][c]
            if char == 'O' or char == ' ': 
                # If it's still ' ' after flood fill but not 'O', it's inside floor
                # Wait, floodfill might not reach all outside if the map is not closed, but assuming valid maps:
                if char == 'O':
                    row_arr.append(0)
                else:
                    row_arr.append(2)
            elif char in char_map:
                row_arr.append(char_map[char])
            else:
                row_arr.append(0) # Default fallback
        # Trim trailing zeroes
        while row_arr and row_arr[-1] == 0:
            row_arr.pop()
        numeric_grid.append(row_arr)
        
    return numeric_grid

def parse_xsb_file(filepath):
    with open(filepath, 'r') as f:
        lines = f.read().splitlines()
        
    levels = []
    current_level = []
    
    for line in lines:
        stripped = line.strip()
        # XSB levels often have title lines or empty lines between them
        if not stripped or stripped.startswith(';'):
            if current_level:
                levels.append(current_level)
                current_level = []
        elif '#' in line: # A valid level line usually contains walls
            current_level.append(line)
            
    if current_level:
        levels.append(current_level)
        
    print(f"Parsed {len(levels)} levels.")
    print("const LEVELS: number[][][] = [")
    for i, lvl in enumerate(levels):
        num_grid = convert_xsb_to_array(lvl)
        print(f"  // 第{i+1}关")
        print("  [")
        for row in num_grid:
            print(f"    {row},")
        print("  ],")
    print("]")

if __name__ == '__main__':
    if len(sys.argv) > 1:
        parse_xsb_file(sys.argv[1])
    else:
        print("Usage: python convert_xsb.py <microban.xsb>")
