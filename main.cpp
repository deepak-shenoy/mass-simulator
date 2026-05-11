/*
 * Mass Simulator
 * May 10th, 2026
 * Deepak Shenoy
 * Desktop Application
 *
 */

#include <saucer/smartview.hpp>
#include <saucer/embedded/all.hpp>
#include <saucer/icon.hpp>

coco::stray start(saucer::application *app)
{
    auto window  = saucer::window::create(app).value();
    auto webview = saucer::smartview::create({.window = window});

    webview->expose("add", [](double a, double b) {
        return a + b;
    });

    webview->expose("multiply", [](double a, double b, double c) {
        return a * b * c;
    });

    webview->embed(saucer::embedded::all());
    webview->serve("/index.html");

    window->set_title("MassSim");

    auto app_icon = saucer::icon::from("icon/masssim.png");
    if (app_icon) {
        window->set_icon(app_icon.value());
    }

    window->set_size({1024, 768});
    window->show();

    co_await app->finish();
}

int main()
{
    return saucer::application::create({.id = "adder"})->run(start);
}
