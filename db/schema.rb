# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_07_13_183423) do
  create_table "currencies", force: :cascade do |t|
    t.string "currency_name"
    t.float "currency_rate"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "data", force: :cascade do |t|
    t.string "column1"
    t.string "column2"
    t.string "column3"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "excels", force: :cascade do |t|
    t.string "column1"
    t.string "column2"
    t.string "column3"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
