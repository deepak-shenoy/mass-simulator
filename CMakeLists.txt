cmake_minimum_required(VERSION 3.25)
project(MassSim
    DESCRIPTION "Mass Simulator"
)

set(CMAKE_CXX_STANDARD 23)

include(FetchContent)

FetchContent_Declare(
    saucer
    GIT_REPOSITORY "https://github.com/saucer/saucer"
    GIT_TAG "v8.0.5"
)

FetchContent_MakeAvailable(saucer)

# Custom target to rebuild the React app before compiling
add_custom_target(react_build ALL
    COMMAND npm run build
    WORKING_DIRECTORY "${CMAKE_SOURCE_DIR}/react-app"
    COMMENT "Building React app..."
)

add_executable(MassSim main.cpp)
target_link_libraries(MassSim PRIVATE saucer::saucer saucer::embedded)

# Copy icon to build directory
file(COPY "${CMAKE_SOURCE_DIR}/icon" DESTINATION "${CMAKE_BINARY_DIR}")

saucer_embed("${CMAKE_SOURCE_DIR}/react-app/dist" TARGET MassSim)

# Ensure React builds before embedding
add_dependencies(MassSim react_build)
add_dependencies(saucer_embedded_pre react_build)
