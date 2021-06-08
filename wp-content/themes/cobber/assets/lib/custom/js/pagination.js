jQuery(document).ready(function ($) {

    var ajaxurl = cobber_pagination.ajax_url;

    function cobber_is_on_screen(elem) {

        if ($(elem)[0]) {

            var tmtwindow = jQuery(window);
            var viewport_top = tmtwindow.scrollTop();
            var viewport_height = tmtwindow.height();
            var viewport_bottom = viewport_top + viewport_height;
            var tmtelem = jQuery(elem);
            var top = tmtelem.offset().top;
            var height = tmtelem.height();
            var bottom = top + height;
            return (top >= viewport_top && top < viewport_bottom) ||
                (bottom > viewport_top && bottom <= viewport_bottom) ||
                (height > viewport_height && top <= viewport_top && bottom >= viewport_bottom);
        }
    }

    var n = window.TWP_JS || {};
    var paged = parseInt(cobber_pagination.paged) + 1;
    var maxpage = cobber_pagination.maxpage;
    var nextLink = cobber_pagination.nextLink;
    var loadmore = cobber_pagination.loadmore;
    var loading = cobber_pagination.loading;
    var nomore = cobber_pagination.nomore;
    var pagination_layout = cobber_pagination.pagination_layout;

    $('.twp-loading-button').click(function () {
        if ((!$('.twp-no-posts').hasClass('twp-no-posts'))) {

            $('.twp-loading-button').text(loading);
            $('.twp-loging-status').addClass('twp-ajax-loading');
            $('.twp-loaded-content').load(nextLink + ' .twp-archive-items', function () {
                if (paged < 10) {
                    var newlink = nextLink.substring(0, nextLink.length - 2);
                } else {

                    var newlink = nextLink.substring(0, nextLink.length - 3);
                }
                paged++;
                nextLink = newlink + paged + '/';
                if (paged > maxpage) {
                    $('.twp-loading-button').addClass('twp-no-posts');
                    $('.twp-loading-button').text(nomore);
                } else {
                    $('.twp-loading-button').text(loadmore);
                }

                $('.twp-loaded-content .twp-archive-items').each(function(){
                    $(this).addClass(paged + '-twp-article-ajax');
                });
                
                $('.twp-ajax-post-load .theme-video-panel').each(function(){

                    var autoplay = $(this).attr('data-autoplay');
                    var vidURL = $(this).find('iframe').attr('src');
                    
                    if( vidURL ){

                        if( vidURL.indexOf('youtube.com') != -1 ){

                            if( autoplay == 'autoplay-enable' ){

                                $(this).find('iframe').attr('src',vidURL+'&enablejsapi=1&autoplay=1&mute=1&rel=0&modestbranding=0&autohide=0&showinfo=0&controls=0&loop=1');

                            }else{

                                $(this).find('iframe').attr('src',vidURL+'&enablejsapi=1&mute=1');

                            }

                        }

                        if( vidURL.indexOf('vimeo.com') != -1 ){

                            if( autoplay == 'autoplay-enable' ){

                                $(this).find('iframe').attr('src',vidURL+'&title=0&byline=0&portrait=0&transparent=0&autoplay=1&controls=0&loop=1');

                            }else{

                                $(this).find('iframe').attr('src',vidURL+'&title=0&byline=0&portrait=0&transparent=0&autoplay=0&controls=0&loop=1');

                            }
                            
                            
                        }

                    }

                });

                var lodedContent = $('.twp-loaded-content').html();
                $('.twp-loaded-content').html('');

                if ($('.article-wraper').hasClass('archive-layout-masonry')) {

                    if ($('.archive-layout-masonry').length > 0) {
                        var content = $(lodedContent);
                        content.hide();
                        grid = $('.archive-layout-masonry');
                        grid.append(content);
                        grid.imagesLoaded(function () {
                            content.show();

                            var winwidth = $(window).width();
                            $(window).resize(function () {
                                winwidth = $(window).width();
                            });

                            if (winwidth > 990) {
                                grid.masonry('appended', content).masonry();
                            } else {
                                grid.masonry('appended', content);
                            }

                        });
                    }

                } else {

                    $('.content-area .article-wraper').append(lodedContent);

                }

                $('.twp-loging-status').removeClass('twp-ajax-loading');

                $('.twp-archive-items').each(function () {

                    if (!$(this).hasClass('twp-article-loaded')) {

                        $(this).addClass(paged + '-twp-article-ajax');
                        $(this).addClass('twp-article-loaded');
                        $(this).find('.theme-video-panel').addClass( paged + '-twp-video-ajax' );
                        $(this).find('.theme-video-panel').removeClass('video-main-wraper');
                    }

                });

                var action = [];
                var iframe;
                var src;
                var ratio_class;

                Cobber_Vimeo();
                Cobber_Video( paged + '-twp-video-ajax', paged + '-twp-video-ajax-2' );

                onYouTubePlayerAPIReady();
                function onYouTubePlayerAPIReady() {

                    jQuery(document).ready(function ($) {
                        "use strict";
                        CobberYoutubeVideo( '.'+paged + '-twp-video-ajax-2' );

                    });
                }

                // Inject YouTube API script
                var tag = document.createElement('script');
                tag.src = "https://www.youtube.com/player_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                // Single Post content gallery slide
                $( '.'+paged + '-twp-article-ajax ul.wp-block-gallery.columns-1, .'+paged + '-twp-article-ajax .wp-block-gallery.columns-1 .blocks-gallery-grid, .'+paged + '-twp-article-ajax .gallery-columns-1').each(function () {
                    $(this).slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        fade: true,
                        autoplay: false,
                        autoplaySpeed: 8000,
                        infinite: true,
                        nextArrow: '<button type="button" class="slide-btn slide-btn-bg slide-next-icon">'+cobber_custom.next_svg+'</button>',
                        prevArrow: '<button type="button" class="slide-btn slide-btn-bg slide-prev-icon">'+cobber_custom.prev_svg+'</button>',
                        dots: false,
                    });
                });

                // Content Gallery popup Start
                $('.entry-content .gallery, .widget .gallery, .wp-block-gallery, .zoom-gallery').each(function () {
                    $(this).magnificPopup({
                        delegate: 'a',
                        type: 'image',
                        closeOnContentClick: false,
                        closeBtnInside: false,
                        mainClass: 'mfp-with-zoom mfp-img-mobile',
                        image: {
                            verticalFit: true,
                            titleSrc: function (item) {
                                return item.el.attr('title');
                            }
                        },
                        gallery: {
                            enabled: true
                        },
                        zoom: {
                            enabled: true,
                            duration: 300,
                            opener: function (element) {
                                return element.find('img');
                            }
                        }
                    });
                });

                // Content Gallery popup End

                $('.twp-archive-items').each(function(){
                    $(this).removeClass(paged + '-twp-article-ajax');
                });

                // Background
                var pageSection = $(".data-bg");
                pageSection.each(function (indx) {
                    if ($(this).attr("data-background")) {
                        $(this).css("background-image", "url(" + $(this).data("background") + ")");
                    }
                });

            });

        }
    });

    if (pagination_layout == 'auto-load') {
        $(window).scroll(function () {

            if (!$('.cobber-auto-pagination').hasClass('twp-ajax-loading') && !$('.cobber-auto-pagination').hasClass('twp-no-posts') && maxpage > 1 && cobber_is_on_screen('.cobber-auto-pagination')) {
                $('.cobber-auto-pagination').addClass('twp-ajax-loading');
                $('.cobber-auto-pagination').text(loading);

                $('.twp-loaded-content').load(nextLink + ' .twp-archive-items', function () {

                    if (paged < 10) {
                        var newlink = nextLink.substring(0, nextLink.length - 2);
                    } else {

                        var newlink = nextLink.substring(0, nextLink.length - 3);
                    }
                    paged++;
                    nextLink = newlink + paged + '/';
                    if (paged > maxpage) {
                        $('.cobber-auto-pagination').addClass('twp-no-posts');
                        $('.cobber-auto-pagination').text(nomore);
                    } else {
                        $('.cobber-auto-pagination').removeClass('twp-ajax-loading');
                        $('.cobber-auto-pagination').text(loadmore);
                    }

                    $('.twp-loaded-content .twp-archive-items').each(function(){
                        $(this).addClass(paged + '-twp-article-ajax');
                    });

                    var lodedContent = $('.twp-loaded-content').html();

                    $('.twp-loaded-content').html('');

                    if ($('.article-wraper').hasClass('archive-layout-masonry')) {

                        if ($('.archive-layout-masonry').length > 0) {
                            var content = $(lodedContent);
                            content.hide();
                            grid = $('.archive-layout-masonry');
                            grid.append(content);
                            grid.imagesLoaded(function () {
                                content.show();

                                var winwidth = $(window).width();
                                $(window).resize(function () {
                                    winwidth = $(window).width();
                                });

                                if (winwidth > 990) {
                                    grid.masonry('appended', content).masonry();
                                } else {
                                    grid.masonry('appended', content);
                                }

                            });
                        }

                    } else {

                        $('.content-area .article-wraper').append(lodedContent);

                    }

                    $('.cobber-auto-pagination').removeClass('twp-ajax-loading');

                    $('.twp-archive-items').each(function(){
                        $(this).removeClass(paged + '-twp-article-ajax');
                    });


                });
            }

        });
    }

    $(window).scroll(function () {

        if (!$('.twp-single-infinity').hasClass('twp-single-loading') && $('.twp-single-infinity').attr('loop-count') <= 3 && cobber_is_on_screen('.twp-single-infinity')) {

            $('.twp-single-infinity').addClass('twp-single-loading');
            var loopcount = $('.twp-single-infinity').attr('loop-count');
            var postid = $('.twp-single-infinity').attr('next-post');

            var data = {
                'action': 'cobber_single_infinity',
                '_wpnonce': cobber_pagination.ajax_nonce,
                'postid': postid,
            };

            $.post(ajaxurl, data, function (response) {

                if (response) {
                    var content = response.data.content.join('');
                    var content = $(content);
                    $('.twp-single-infinity').before(content);
                    var newpostid = response.data.postid['0'];
                    $('.twp-single-infinity').attr('next-post', newpostid);

                    $('article#post-' + postid + ' ul.wp-block-gallery.columns-1, article#post-' + postid + ' .wp-block-gallery.columns-1 .blocks-gallery-grid, article#post-' + postid + ' .gallery-columns-1').each(function () {
                        $(this).slick({
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            fade: true,
                            autoplay: true,
                            autoplaySpeed: 8000,
                            infinite: true,
                            nextArrow: '<button type="button" class="slide-btn slide-btn-bg slide-next-icon">'+cobber_custom.next_svg+'</button>',
                            prevArrow: '<button type="button" class="slide-btn slide-btn-bg slide-prev-icon">'+cobber_custom.prev_svg+'</button>',
                            dots: false
                        });
                    });

                    $('article').each(function () {

                         if ($('body').hasClass('booster-extension') && $(this).hasClass('after-load-ajax') ) {

                                var cid = $(this).attr('id');
                                $(this).addClass( cid );
                                   
                                likedislike(cid);
                                booster_extension_post_reaction(cid);

                        }

                        $(this).removeClass('after-load-ajax');

                    });

                }

                $('.twp-single-infinity').removeClass('twp-single-loading');
                loopcount++;
                $('.twp-single-infinity').attr('loop-count', loopcount);

            });

        }

    });

});