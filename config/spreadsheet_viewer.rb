require 'roo'

def display_spreadsheet
  spreadsheet = Roo::Spreadsheet.open('path/to/your/spreadsheet.xlsx')

  spreadsheet.each_row_streaming do |row|
    values = row.map(&:value)
    puts values.join(', ')
  end
end

display_spreadsheet
